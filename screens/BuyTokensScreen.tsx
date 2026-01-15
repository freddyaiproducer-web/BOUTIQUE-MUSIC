
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon } from '../components/Icons';
import { INITIAL_DEPOSIT_USD } from '../constants';

interface TokenPackage {
    amount: number;
    price: number;
}

const TOKEN_PACKAGES: TokenPackage[] = [
    { amount: 1, price: INITIAL_DEPOSIT_USD },
    { amount: 5, price: INITIAL_DEPOSIT_USD * 5 * 0.95 }, // 5% discount
    { amount: 10, price: INITIAL_DEPOSIT_USD * 10 * 0.90 }, // 10% discount
];

const BuyTokensScreen: React.FC = () => {
    const { user, buyTokens, navigateTo } = useAppContext();
    const [confirmation, setConfirmation] = useState('');

    const handleBuy = (amount: number) => {
        buyTokens(amount);
        setConfirmation(`¡Has comprado ${amount} token(s) con éxito!`);
        setTimeout(() => setConfirmation(''), 3000);
    };

    return (
        <div className="p-4">
            <button onClick={() => navigateTo('discover')} className="flex items-center gap-2 mb-6 text-brand-text-secondary">
                <ChevronLeftIcon className="w-6 h-6" /> Volver
            </button>
            <div className="w-full max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-center mb-2">Comprar Tokens</h2>
                <p className="text-center text-brand-text-secondary mb-8">Tu saldo: {user.tokenBalance} token(s)</p>

                {confirmation && (
                    <div className="bg-brand-primary/20 text-brand-primary text-center p-3 rounded-lg mb-6">
                        {confirmation}
                    </div>
                )}

                <div className="space-y-4">
                    {TOKEN_PACKAGES.map((pkg) => (
                        <div key={pkg.amount} className="bg-brand-surface rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <p className="text-xl font-bold">{pkg.amount} Token{pkg.amount > 1 ? 's' : ''}</p>
                                <p className="text-brand-text-secondary">${pkg.price.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={() => handleBuy(pkg.amount)}
                                className="bg-brand-primary text-black font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Comprar
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BuyTokensScreen;