import Spinner from '../spinner/Spinner'
import Skeleton from '../skeleton/Skeleton';
import ErrorMessage from '../errorMessage/errorMessage';

const setContent = (process, Component, data) => {
    // process - процес, який відбувається на сторінці 
    // Component - Компонент, який показується, якщо process confirmed
    // data - пропси, які передаються в Компонент 
    switch (process) {
        case 'waiting':
            return <Skeleton />;
        case 'loading':
            return <Spinner />;
        case 'confirmed':
            return <Component data={data} />;
        case 'error':
            return <ErrorMessage />;
        default:
            throw new Error('Unexpected process state')
    }
}

export default setContent;