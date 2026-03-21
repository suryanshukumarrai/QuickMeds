export const CART_UPDATED_EVENT = 'quickmeds:cart-updated';

export function getCartItemCount(cartData) {
  return (cartData?.items || []).reduce((total, item) => total + item.quantity, 0);
}

export function emitCartUpdated(cartData) {
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: { cartData } }));
}
