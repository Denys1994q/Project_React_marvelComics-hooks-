// стилі і квартинки 
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
// хуки 
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import setContent from '../utils/utils'

// ПОКАЗУЄМО РАНДОМНОГО ПЕРСОНАЖА НА СТОРІНЦІ ((при оновленні сторінки персонаж міняється))
// Алгоритм: 
// 1. Звертаємося до сервера по дані персонажа
// - компонент MarvelService: відповідає за надсилання fetch запитів на сервер. Ф-ія getCharacter
// 2. Обробляємо дані як нам треба 
// - компонент MarvelService: Ф-ія _transformCharacter, включена в getCharacter
// 3. Виводимо дані на сторінку (ДАНІ ЙДУТЬ В STATE, А ЗІ STATE У ВЕРСТКУ)
// Компонент RandomChar:
// Надсилаємо запит (updateHero), зберігаємо відповідь у state, в залежності від відповіді показуємо один із state
// - є три різні свойства state: char (показує верстку персонажа), loading (показує верстку спінера із загрузкою), error (показуємо верстку з помилкою)

const RandomChar = () => {
    const [char, setChar] = useState({}); // дані 
    const { getCharacter, clearError, process, setProcess } = useMarvelService();
    // анімація
    const [show, setShow] = useState(false);

    // хуки
    useEffect(() => {
        updateHero();
    }, [])

    // функції 
    function updateHero() {
        setShow(false);
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacter(id) // отримали потрібний об'єкт
            .then(onCharLoaded)
            .then(() => {setProcess('confirmed')} )
    }
    function onCharLoaded(char) {
        setChar(char);
        setShow(true);
    }

    return (
            <div className="randomchar">
                <div className="randomchar-main">
                    {setContent(process, View, char)}
                </div>
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br />
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
                        <div className="inner" onClick={updateHero}>try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div>
    )

}

const View = ({ data }) => {
    const { name, description, thumbnail, homepage, wiki } = data;
    const noImage = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className={thumbnail === noImage ? 'randomchar__imgNo' : 'randomchar__img'} />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;