import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ShoppingCart, X, Trash2, ArrowRight } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

export function CartDrawer() {
  const { cart, isCartOpen, toggleCart, removeFromCart } = useStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const totalCost = cart.reduce((total, item) => total + ((item.asset.pricePerDay || 300) * item.rentalDays), 0);

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}
        onClick={() => toggleCart(false)}
      />
      <div 
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: '400px',
          backgroundColor: 'var(--color-bg)',
          zIndex: 10000,
          borderLeft: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-5px 0 25px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }}>
            <ShoppingCart /> Rental Cart
          </h2>
          <button 
            onClick={() => toggleCart(false)}
            style={{ background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer' }}
          >
            <X />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '2rem' }}>
              Your cart is empty.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ 
                  background: 'var(--color-bg-secondary)', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  position: 'relative'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>{item.asset.model}</h4>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    Type: {item.asset.type} <br/>
                    Duration: {item.rentalDays} Days <br/>
                    Rate: ${item.asset.pricePerDay || 300}/day
                  </div>
                  <div style={{ marginTop: '0.5rem', fontWeight: 'bold', color: 'var(--color-brand-yellow)' }}>
                    Total: ${(item.asset.pricePerDay || 300) * item.rentalDays}
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text)', fontSize: '1.25rem', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span>${totalCost.toLocaleString()}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={() => setIsCheckoutOpen(true)}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: cart.length === 0 ? 'var(--color-border)' : 'var(--color-brand-yellow)', 
              color: '#000',
              border: 'none', 
              borderRadius: '4px', 
              fontWeight: 'bold', 
              fontSize: '1rem',
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            PROCEED TO CHECKOUT <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {isCheckoutOpen && (
        <CheckoutModal 
          totalAmount={totalCost} 
          onClose={() => setIsCheckoutOpen(false)} 
        />
      )}
    </>
  );
}
