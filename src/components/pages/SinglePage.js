// стилі і квартинки 
import '../comics/comics.css'; // для header
import AppBanner from '../appBanner/AppBanner'
// хуки 
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import setContent from '../utils/utils';

const SinglePage = ({Component, dataType}) => {
    // name, id з url 
    const {id} = useParams();
    // дані
    const [data, setData] = useState(null);
    const { getCharacterByName, getComic, clearError, process, setProcess } = useMarvelService();

    // запуск 
    useEffect(() => {
        updateData();
    }, [id])

    // сервер 
    const updateData = () => {
            clearError();
            switch (dataType) {
                case 'comic': 
                    getComic(id).then(onDataLoaded).then(() => {setProcess('confirmed')} );
                    break;
                case 'character': 
                    getCharacterByName(id).then(onDataLoaded).then(() => {setProcess('confirmed')} );
            }
    }

    const onDataLoaded = (res) => {
        setData(res)
    }

    return (
        <>
            <AppBanner />
            {setContent(process, Component, data)}   
        </>
    )
}

export default SinglePage;