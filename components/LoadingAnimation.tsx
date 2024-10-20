import { OrbitProgress } from 'react-loading-indicators';

export default function LoadingAnimation() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
         <OrbitProgress variant="spokes" color="#e6e6e6" size="medium" text="" textColor="" />
        </div>
    );
}