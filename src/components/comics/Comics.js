// стилі і картинки 
import './comics.css';
import AppBanner from '../appBanner/AppBanner';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';
// хуки 
import { useEffect, useState } from 'react';
import useMarvelService from '../../services/MarvelService';
import { Link } from 'react-router-dom';

const setContent = (process, Component, disabledButtonWhenLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
        case 'loading':
            return disabledButtonWhenLoading ? <Component /> : <Spinner />;
        case 'confirmed':
            return <Component />;
        case 'error':
            return <ErrorMessage />;
        default:
            throw new Error('Unexpected process state')
    }
}

const Comics = () => {
    const { loading, error, getComics, getComic, process, setProcess } = useMarvelService();

    const [comics, setComics] = useState([]); // дані 
    const [start, setStart] = useState(8);
    const [secondLoading, setsecondLoading] = useState(false);
    const [disabledButtonWhenLoading, setDisabledButtonWhenLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);

    useEffect(() => {
        requestComics()
    }, [])

    const requestComics = (start, secloading) => {
        if (secloading) {
            setsecondLoading(true)
        }
        setDisabledButtonWhenLoading(true)
        getComics(start)
            .then(showComics)
            .then(() => {setProcess('confirmed')} )
    }

    const showComics = (res) => {
        let ended = false;
        if (res.length < 8) {
            ended = true;
        }
        setComics(comics => [...comics, ...res]);
        setStart(start => start + 8);
        setDisabledButtonWhenLoading(false)
        setComicsEnded(ended)
    }

    const cards = comics.map((item, i) => {
        return (
            <li key={i} className='char__item-comics'>
                <Link to={`/comics/${item.id}`}>
                    <img src={item.thumbnail} alt="" />
                    <p className='char__grid_text'>{item.title}</p>
                    <p className='char__grid_price'>{item.price}$</p>
                </Link>
            </li>
        )
    })

    const setClass = loading && !secondLoading || error ? 'char__grid-center-comics' : 'char__grid-comics';
    return (
        <>
            <div className='comics'>
                <AppBanner />
                <ul className={setClass}>
                    {setContent(process, () => cards, secondLoading )}
                </ul>
                <button
                    style={{ 'display': comicsEnded ? 'none' : 'block' }}
                    className='loadMore'
                    disabled={disabledButtonWhenLoading}
                    onClick={() => requestComics(start, true)}>
                    Load more
                </button>
            </div>
        </>
    )
}

export default Comics;
