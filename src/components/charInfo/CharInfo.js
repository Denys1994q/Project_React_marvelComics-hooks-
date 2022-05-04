import { Component } from 'react';
import './charInfo.scss';

import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';

import PropTypes from 'prop-types';

const noImage = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'

// ф-ія, яка виводить в окремий розділ повну інформацію про одного з персонажів 

class CharInfo extends Component {

    comicsArr = () => {
        const comics = this.props.activeHero.comics;
        const slicedComicsArr = comics.slice(0, 10);

        if (comics.length == 0) {
            return (
                <li className="char__comics-item" key={123}>
                    no comics
                </li>
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

    render() {
        const {loading, skeleton} = this.props.activeHero;

        const showSkeleton = skeleton ? <Skeleton/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(skeleton || loading) ? <Info comicses={this.comicsArr} components={this.props.activeHero} /> : null;

        return (
            <div className="char__info">
                {showSkeleton}
                {spinner}
                {content}
                {/* {loading ? <Spinner /> : <Info comicses={this.comicsArr} components={this.props.activeHero} />} */}
            </div>
        )
    }
}

const Info = ({components, comicses}) => {
    const {name, thumbnail, description} = components;
    return (
        <>
            <div className={thumbnail === noImage ? 'char__basics-no' : 'char__basics'} >
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
                {comicses()}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    activeHero: PropTypes.object
}

export default CharInfo;