import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCartInfo } from '../store/slices/cartSlice';
import './styles/CartButton.css';

function CartButton() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const { draftId, count } = useAppSelector((s) => s.cart);

  const loadCartInfo = async () => {
    if (user) {
      dispatch(fetchCartInfo());
    }
  };

  useEffect(() => {
    loadCartInfo();
  }, [user]);

  // Обновляем корзину при событии
  useEffect(() => {
    const handleCartUpdate = () => {
      loadCartInfo();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const baseUrl = import.meta.env.BASE_URL || '/';
  const cartIconUrl = `${baseUrl}corzina.svg`;

  const isActive = draftId > 0;

  return (
    <span
      className="cart-button"
      style={{ opacity: isActive ? 1 : 0.5, cursor: isActive ? 'pointer' : 'default' }}
      onClick={() => {
        if (isActive) {
          navigate(`/requests/${draftId}`);
        }
      }}
    >
      <img className="vector" src={cartIconUrl} alt="Корзина" />
      <div className="group-2">
        <div className="ellipse"></div>
        <div className="text-wrapper-2">{count}</div>
      </div>
    </span>
  );
}

export default CartButton;

