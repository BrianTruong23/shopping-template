
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getStoreId } from '../../../lib/store';

export async function POST(req: NextRequest) {
  try {
    // Use Service Role Key to bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await req.json();
    const { customer_email, customer_name, total_price, items } = body;

    // Input validation
    if (!customer_email || total_price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: customer_email, customer_name, total_price' },
        { status: 400 }
      );
    }

    // Identify store
    // User provided specific store ID: 6aab4a51-0d89-47ee-b853-2f29dca2d480
    const storeId = '6aab4a51-0d89-47ee-b853-2f29dca2d480';

    if (!storeId) {
      console.error(`Store ID not configured`);
      return NextResponse.json(
        { error: 'Store configuration error' },
        { status: 500 }
      );
    }

    console.log(`Creating order for store ID: ${storeId}`);

    // Insert order using admin client
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert({
        store_id: storeId,
        customer_email,
        customer_name,
        total_price,
        currency: 'USD',
        status: 'paid', // Mark as paid since this is called after PayPal success
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting order:', error);
      return NextResponse.json(
        { error: 'Failed to create order', details: error },
        { status: 500 }
      );
    }

    console.log('Order created successfully:', data.id);

    // Insert order items if provided
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => {
        // Use totalPrice if available (includes customization), otherwise parse price string
        const price = item.totalPrice || (typeof item.price === 'string' 
          ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
          : (item.price || 0));
        
        const quantity = item.quantity || 1;

        return {
          order_id: data.id,
          store_id: storeId,
          product_name: item.title || item.name,
          quantity: quantity,
          unit_price: price,
          currency: 'USD'
        };
      });

      const { error: itemsError } = await supabaseAdmin
        .from('order_products')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error inserting order items:', itemsError);
        // Return error details for debugging
        return NextResponse.json({ 
          success: true, 
          order: data,
          itemsError: itemsError 
        }, { status: 201 });
      }
    }

    console.log('Order created successfully:', data.id);

    return NextResponse.json({ success: true, order: data }, { status: 201 });
  } catch (err) {
    console.error('Unexpected error in create-order:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err },
      { status: 500 }
    );
  }
}
