import React, { Component } from 'react';

import MarvelService from '../../services/MarvelService';

import './charList.scss';
import '../randomChar/randomChar.scss';

import Spinner from '../spinner/Spinner';

import PropTypes from 'prop-types';

// виводить список всіх персонажів на сторінку (при оновленні сторінки персонажі міняються) 

// 2. local storage: спочатку записується state з 210, потім рендер, потім componentDidMount, в якому змінюється стейт, який береться з local storage. Тому треба, щоб в local storage вже був цей стейт, а він створиться при кліці на загрузку нових персонажів, працює componentDidUpdate. В результаті перші 9 персонажів показуються саме ті, на яких закінчив користувач. 

class CharList extends Component {
    state = {
        heroes: [],
        loading: true,
        disabledButtonWhenLoading: false,
        hideButton: false,
        startForHeroes: localStorage.getItem('heroes') ? localStorage.getItem('heroes') : 210, // треба сюди додавати к-сть героїв, які показувати. Тоді при кліку на загрузку буде правильно починати список. 
    }
    
    componentDidMount() { // монтується лише один раз !!! // запустити щось після того як компонент відмальовано на сторінку // коли треба запустити щось перший раз після того як компонент відмальовано
        // window.addEventListener('scroll', this.showNewHeroesAfterScroll);
        const hero = localStorage.getItem('heroes') // 2.
        this.setState({startForHeroes: +hero}) // 2. 

        this.loadAllHeroes(this.state.startForHeroes); // створюємо список героїв, які підвантажуються при загрузці сторінки (лише перші 9), якщо не передано аргумент ставиться автоматично 210 і 9. Тут передаємо аргумент, тому що треба брати з локал стореджа оновлений стейт. 
    }

    componentDidUpdate() { // якщо треба після кожного оновлення компоненту щось робити // виконується кожен раз коли змінюється state чи приходять нові props ззовні
        localStorage.setItem('heroes', this.state.startForHeroes-9) // 2. 
    }
 
    MarvelService = new MarvelService(); // екземпляр класа для відправки запитів    
    // створюємо список героїв, які підвантажуються при загрузці сторінки (всі герої по 9 персонажів)
    loadAllHeroes = (start, howheroestoshow) => {
        this.onCharListLoading()
        this.MarvelService.getAllCharacters(start, howheroestoshow)
            .then(this.loadAllHeroesChangeState)
    }
    loadAllHeroesChangeState = (newHeroes) => {
        let ended = false;
        if (newHeroes.length < 9) {
            ended = true;
        }
        this.setState(({heroes, startForHeroes}) => ({
            heroes: [...heroes,...newHeroes],
            loading: false,
            startForHeroes: startForHeroes + 9,
            disabledButtonWhenLoading: false,
            hideButton: ended
        }))
        
    }
    onCharListLoading = () => {
        this.setState({
            disabledButtonWhenLoading: true
        })
    }

    // скрол 
    // showNewHeroesAfterScroll = () => {
    //     if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
    //             this.loadAllHeroes();
    //     }
    // }
    // componentWillUnmount() {
    //     window.removeEventListener('scroll', this.showNewHeroesAfterScroll)
    // }

    // ф-ія для виділення картинки підсвіткою 
    changeClick = (clickedId) => {
        this.setState(({ heroes }) => {
            heroes.map(item => {
                item.activeClass = false;
            })
            const index = heroes.findIndex(elem => elem.id === clickedId); // індекс елемента, по якому клікнули 
            const old = heroes[index]; // копія елементу для роботи з нею
            const newItem = { ...old, activeClass: !old.activeClass }; // новий елемент: всі свойства старого + свойство activeClass поміняне на протилежне 
            const newArray = [...heroes.slice(0, index), newItem, ...heroes.slice(index + 1)] // новий масив, у який входить новий елемент 
            return {
                heroes: newArray
            }
        })
    }

    render() {
        const { showInfoAboutHero } = this.props;
        const noImage = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'

        const cards = this.state.heroes.map(({ id, thumbnail, name, activeClass }) => {
            return (
                <li className={activeClass ? 'char__item char__item_selected' : 'char__item'} key={id} onClick={() => { showInfoAboutHero(id); this.changeClick(id) }}>
                    <img src={thumbnail} className={thumbnail === noImage ? 'randomchar__imgNo' : 'randomchar__img'} alt="abyss" />
                    <div className="char__name">{name}</div>
                </li>
            )
        })

        return (
            <div className="char__list">
                <ul className={this.state.loading ? "char__grid-center" : "char__grid"} >
                    {this.state.loading ? <Spinner key={89} /> : null}
                    {cards}
                </ul>
                <button className="button button__main button__long"
                    style={{ 'display': this.state.hideButton ? 'none' : 'block' }}
                    disabled={this.state.disabledButtonWhenLoading}
                    onClick={() => this.loadAllHeroes(this.state.startForHeroes)}>
                    <div className="inner" >load more</div>
                </button>
                {/* <li ref={this.setRef}>dsadasd</li> */}
            </div>
        )
    }

}

CharList.propTypes = {
    showInfoAboutHero: PropTypes.func.isRequired
}

export default CharList;
