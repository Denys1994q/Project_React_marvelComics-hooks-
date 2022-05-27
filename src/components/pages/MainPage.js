// стилі і картинки 
import decoration from '../../resources/img/vision.png';
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import SearchHero from "../searchHero/searchHero";
// хуки
import { useState } from 'react';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import { Helmet } from 'react-helmet';

const MainPage = () => {

    const [clickedId, setClickedId] = useState(null);
    
    const getIdOfClickedHero = (id) => {
        setClickedId(id);
    }

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Marvel information portal"
                />
                <title>Marvel information</title>
            </Helmet>
            <ErrorBoundary>
                <RandomChar />
            </ErrorBoundary>
            <div className="char__content">
                <ErrorBoundary>
                    <CharList getIdOfClickedHero={getIdOfClickedHero} />
                </ErrorBoundary>
                <div>
                    <CharInfo clickedId={clickedId} />
                    <SearchHero />
                </div>
            </div>
            <img className="bg-decoration" src={decoration} alt="vision" />
        </>

    )
}

export default MainPage;