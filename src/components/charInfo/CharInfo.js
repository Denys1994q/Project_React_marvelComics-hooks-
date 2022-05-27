// стилі і квартинки 
import './charInfo.scss';
import setContent from '../utils/utils';
// хуки 
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// ф-ія, яка виводить в окремий розділ повну інформацію про одного з персонажів 

const CharInfo = (props) => { 
    const clickedHeroId = props.clickedId;// id героя, по якому клікнули в Компоненті CharList
    const { getCharacter, process, setProcess } = useMarvelService();
    const [clickedHero, setClickedHero] = useState(null); // дані героя, по якому клікнули 
 
    useEffect(() => {
        showClickedHero(clickedHeroId);
    }, [clickedHeroId])

    // сервер
    const showClickedHero = (id) => {
        if (id) {
            getCharacter(id)
            .then(changeStateClickedHero)
            .then(() => {setProcess('confirmed')} )
        }
    }
    const changeStateClickedHero = (res) => {
        setClickedHero(res);
    }

    return (
        <div className="char__info">
           {setContent(process, HeroInfo, clickedHero)}
        </div>
    )
}

const HeroInfo = ({ data }) => {
    const { name, comics, thumbnail, description } = data;
    const classes = thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? 'char__basics-no' : 'char__basics';

    const getComicId = () => {
            let comicId = null;
            comics.map(item => {
                comicId = item.resourceURI.substr(item.resourceURI.length - 5, item.resourceURI.length).replace(/\D/g, ''); // обрізати з кінця 5 символів і всі не цифри замінити 
            })
            return comicId;
    }

    const modifyComicsList = () => {
            const comicsMod = comics;
            const slicedComicsArr = comicsMod.slice(0, 10);
    
            if (comicsMod.length === 0) {
                return (
                    <li className="char__comics-item" key={123}> no comics </li>
                )
            }
            else {
                return (
                    slicedComicsArr.map((item, i) => {
                        return (
                            <li className="char__comics-item" key={i}>
                                {item.name}
                            </li>
                        )
                    })
                )
            }
    }

    return (
        <>
            <div className={classes} >
                <img src={thumbnail} alt="abyss" />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href="#" className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href="#" className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                <Link to={`/comics/${getComicId()}`} onClick={() => getComicId()}>{modifyComicsList()}</Link>
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    clickedId: PropTypes.object
}

export default CharInfo;