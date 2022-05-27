import './singleCharacterLayout.scss'
import { Link } from 'react-router-dom';

const SingleCharacterLayout = ({data}) => {
    const { thumbnail, name, description, id } = data;
    return (
        <div className="single-comic" key={id}>
            <img src={thumbnail} alt={name} className="single-comic__img" />
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{description}</p>
            </div>
            <Link to='/' className="single-comic__back">Back</Link>
        </div>
    )
}

export default SingleCharacterLayout;