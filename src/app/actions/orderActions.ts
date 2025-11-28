'use server';

import { createClient } from '../../lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteOrder(orderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Unauthorized' };
  }

  // 1. Fetch the order to verify ownership and time
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('*, order_products(*)')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) {
    return { success: false, message: 'Order not found' };
  }

  if (order.customer_email.toLowerCase() !== user.email?.toLowerCase()) {
    return { success: false, message: 'Unauthorized access to order' };
  }

  // 2. Check if order is recent (< 30 minutes)
  const createdAt = new Date(order.created_at).getTime();
  const now = Date.now();
  const diffInMinutes = (now - createdAt) / (1000 * 60);

  if (diffInMinutes > 30) {
    return { success: false, message: 'Order cannot be cancelled after 30 minutes' };
  }

  // 3. Delete order products first (manual cascade)
  const { error: productsError } = await supabase
    .from('order_products')
    .delete()
    .eq('order_id', orderId);

  if (productsError) {
    console.error('Error deleting order products:', productsError);
    return { success: false, message: 'Failed to delete order items' };
  }

  // 4. Delete the order
  const { error: orderError } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (orderError) {
    console.error('Error deleting order:', orderError);
    return { success: false, message: 'Failed to delete order' };
  }

  revalidatePath('/orders');
  return { success: true, message: 'Order cancelled successfully' };
}
