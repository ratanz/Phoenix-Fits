import React from 'react';
import { BlinkBlur } from 'react-loading-indicators';

const ProductAnimation: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-transparent backdrop-blur-lg shadow-sm shadow-white border border-white/20 p-20 rounded-lg text-center">
                <BlinkBlur color="#e6e6e6" size="medium" text="" textColor="" />
                <p className="text-lg font-semibold text-zinc-200/80 mt-10 animate-pulse">
                    Adding product please wait...
                </p>
            </div>
        </div>
    );
};

export default ProductAnimation;