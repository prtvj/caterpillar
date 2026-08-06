import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, CreditCard, CheckCircle, Loader } from 'lucide-react';

interface Props {
  totalAmount: number;
  onClose: () => void;
}

export function CheckoutModal({ totalAmount, onClose }: Props) {
  const { clearCart, toggleCart } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate network request for payment gateway
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
      
      // Close checkout and cart after 2 seconds
      setTimeout(() => {
        onClose();
        toggleCart(false);
      }, 2000);
    }, 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.75)',
      zIndex: 11000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '500px',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <button 
          onClick={onClose}
          disabled={isProcessing || isSuccess}
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer' }}
        >
          <X />
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ color: 'var(--color-text)', marginBottom: '0.5rem' }}>Payment Successful!</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Thank you for your rental order. Your equipment is confirmed.</p>
          </div>
        ) : (
          <>
            <h2 style={{ margin: '0 0 1.5rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard /> Secure Checkout
            </h2>
            
            <div style={{ background: 'var(--color-bg-secondary)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Total Amount to Pay:</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-brand-yellow)' }}>
                ${totalAmount.toLocaleString()}
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Cardholder Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Card Number</label>
                <input 
                  required
                  type="text" 
                  value={formData.cardNumber}
                  onChange={e => setFormData({...formData, cardNumber: e.target.value})}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Expiry (MM/YY)</label>
                  <input 
                    required
                    type="text" 
                    value={formData.expiry}
                    onChange={e => setFormData({...formData, expiry: e.target.value})}
                    placeholder="MM/YY"
                    maxLength={5}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>CVC</label>
                  <input 
                    required
                    type="text" 
                    value={formData.cvc}
                    onChange={e => setFormData({...formData, cvc: e.target.value})}
                    placeholder="123"
                    maxLength={4}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text)' }}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                style={{ 
                  marginTop: '1rem',
                  width: '100%', 
                  padding: '1rem', 
                  background: 'var(--color-brand-yellow)', 
                  color: '#000',
                  border: 'none', 
                  borderRadius: '6px', 
                  fontWeight: 'bold', 
                  fontSize: '1rem',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: isProcessing ? 0.7 : 1
                }}
              >
                {isProcessing ? (
                  <>Processing <Loader className="animate-spin" size={20} style={{ animation: 'spin 1s linear infinite' }} /></>
                ) : (
                  `PAY $${totalAmount.toLocaleString()}`
                )}
              </button>
            </form>
          </>
        )}
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
