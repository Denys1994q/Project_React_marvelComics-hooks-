import './SingleComicLayout.scss'
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const SingleComicLayout = ({data}) => {
    
    const { title, thumbnail, price, description, languages, pages } = data;

    return (
        <div className="single-comic">
            <Helmet>
                <meta
                    name="description"
                    content="Marvel information portal"
                />
                <title>{title}</title>
            </Helmet>
            <img src={thumbnail} alt={title} className="single-comic__img" />
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">Pages: {pages}</p>
                <p className="single-comic__descr">{languages}</p>
                <div className="single-comic__price">{price}$</div>
            </div>
            <Link to='/comics' className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicLayout;