// стилі і картинки 
import './charList.scss';
import '../randomChar/randomChar.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage';
// хуки 
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';

// виводить список всіх персонажів на сторінку (при оновленні сторінки персонажі міняються) 

const setContent = (process, Component, disabledButtonWhenLoading) => {
    // process - процес, який відбувається на сторінці 
    // Component - Компонент, який показується, якщо process confirmed
    // data - пропси, які передаються в Компонент 
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

const CharList = (props) => {
    // сервер
    const [heroes, setHeroes] = useState([]); // дані
    const [startForHeroes, setStartForHeroes] = useState(localStorage.getItem('heroes') ? localStorage.getItem('heroes') : 210)
    const { loading, getAllCharacters, process, setProcess } = useMarvelService();
    // стилі 
    const [disabledButtonWhenLoading, setDisabledButtonWhenLoading] = useState(false);
    const [hideButton, setHideButton] = useState(false);

    useEffect(() => { // монтується лише один раз !!! // запустити щось після того як компонент відмальовано на сторінку // коли треба запустити щось перший раз після того як компонент відмальовано
        // window.addEventListener('scroll', this.showNewHeroesAfterScroll);
        const hero = localStorage.getItem('heroes') // 2.
        setStartForHeroes(+hero);

        loadAllHeroes(startForHeroes, true); // створюємо список героїв, які підвантажуються при загрузці сторінки (лише перші 9), якщо не передано аргумент ставиться автоматично 210 і 9. Тут передаємо аргумент, тому що треба брати з локал стореджа оновлений стейт. 
    }, [])

    useEffect(() => { // якщо треба після кожного оновлення компоненту щось робити // виконується кожен раз коли змінюється state чи приходять нові props ззовні
        localStorage.setItem('heroes', startForHeroes - 9)
    })

    // створюємо список героїв, які підвантажуються при загрузці сторінки (всі герої по 9 персонажів)
    function loadAllHeroes(start, initial) {
        initial ? setDisabledButtonWhenLoading(false) : setDisabledButtonWhenLoading(true);
        getAllCharacters(start)
            .then(loadAllHeroesChangeState)
            .then(() => {setProcess('confirmed')} )
    }
    function loadAllHeroesChangeState(newHeroes) {
        let ended = false;
        if (newHeroes.length < 9) {
            ended = true;
        }
        setHeroes(heroes => [...heroes, ...newHeroes]);
        setStartForHeroes(startForHeroes => startForHeroes + 9);
        setDisabledButtonWhenLoading(false);
        setHideButton(ended)   
    }

    // ф-ія для виділення картинки підсвіткою 
    function changeClick(clickedId) {
        setHeroes(heroes => {
            heroes.map(item => item.activeClass = false);
            const index = heroes.findIndex(elem => elem.id === clickedId); // індекс елемента, по якому клікнули 
            const old = heroes[index]; // копія елементу для роботи з нею
            const newItem = { ...old, activeClass: !old.activeClass }; // новий елемент: всі свойства старого + свойство activeClass поміняне на протилежне 
            const newArray = [...heroes.slice(0, index), newItem, ...heroes.slice(index + 1)] // новий масив, у який входить новий елемент 
            return newArray
        })
    }

    const noImage = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

    const cards = heroes.map(({ id, thumbnail, name, activeClass }) => {
        return (
            <CSSTransition key={id} timeout={1500} classNames="char__item">
                <li
                    className={activeClass ? 'char__item char__item_selected' : 'char__item'}
                    key={id}
                    onClick={() => { props.getIdOfClickedHero(id); changeClick(id) }} >
                    <img src={thumbnail} className={thumbnail === noImage ? 'randomchar__imgNo' : 'randomchar__img'} alt="abyss" />
                    <div className="char__name">{name}</div>
                </li>
            </CSSTransition>
        )
    })

    return (
        <div className="char__list">
            <ul className={heroes.length > 0 ? "char__grid" : "char__grid-center"} >
                <TransitionGroup component={null}>
                    {setContent(process, () => cards, disabledButtonWhenLoading )}
                </TransitionGroup>
            </ul>
            <button className="button button__main button__long"
                style={{ 'display': hideButton ? 'none' : 'block' }}
                disabled={disabledButtonWhenLoading} // тру - це виключена кнопка 
                onClick={() => loadAllHeroes(startForHeroes)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    getIdOfClickedHero: PropTypes.func.isRequired
}

export default CharList;
