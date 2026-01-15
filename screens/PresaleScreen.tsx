
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon } from '../components/Icons';

const PresaleScreen: React.FC = () => {
    const { presaleState, reservePresaleToken, navigateTo } = useAppContext();
    const [message, setMessage] = useState('');

    const progress = (presaleState.sold / presaleState.total) * 100;

    const handleReserve = () => {
        reservePresaleToken();
        setMessage('¡Token reservado con éxito!');
        setTimeout(() => setMessage(''), 2000);
    };

    return (
        <div className="p-4">
            <button onClick={() => navigateTo('rewards')} className="flex items-center gap-2 mb-6 text-brand-text-secondary">
                <ChevronLeftIcon className="w-6 h-6" /> Volver
            </button>
            <div className="w-full max-w-sm mx-auto bg-brand-surface rounded-2xl p-6 flex flex-col items-center text-center shadow-lg">
                <h2 className="text-2xl font-bold">Preventa Escalonada</h2>
                <p className="text-sm text-brand-text-secondary mt-1 mb-6">Reserva tu token antes del lanzamiento público.</p>
                
                <div className="w-full my-4">
                    <div className="w-full bg-brand-surface-light rounded-full h-3">
                        <div className="bg-brand-primary h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                        <span className="text-brand-text-secondary">{presaleState.sold} vendidos</span>
                        <span>{presaleState.total} total</span>
                    </div>
                </div>

                <div className="w-full flex gap-2 my-4">
                    <button className="w-full bg-brand-surface-light py-3 rounded-lg font-semibold">Top 10 Holders</button>
                    <button className="w-full bg-brand-surface-light py-3 rounded-lg font-semibold text-brand-text-secondary">Público</button>
                </div>

                {message && <p className="text-brand-primary my-4">{message}</p>}

                <button
                    onClick={handleReserve}
                    disabled={presaleState.sold >= presaleState.total}
                    className="w-full mt-4 bg-brand-primary text-black font-bold py-4 rounded-xl text-lg hover:opacity-90 transition-transform transform hover:scale-105 disabled:bg-brand-surface-light disabled:text-brand-text-secondary disabled:scale-100"
                >
                   {presaleState.sold >= presaleState.total ? 'Agotado' : 'Reservar token'}
                </button>
            </div>
        </div>
    );
};

export default PresaleScreen;