import { useContext } from 'react';
import { CartContext } from '../components/CartContext';

export const useCart = () => useContext(CartContext);