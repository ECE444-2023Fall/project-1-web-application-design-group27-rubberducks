import React from 'react';
import Navbar from './navbar';
import OrderModal from './orderModal';
//TODO use appModal included in navbar itself
import AddressModal from './addressModal';
import AppModal from './appModal';
import Footer from './footer';
import OrderUtils from '../utils/orderUtils.js';
import ItemUtils from '../utils/itemUtils.js';
import { gAuth } from '../utils/loginUtils.js'; 

const Item = React.createClass({
    getInitialState() {
        return {
            show_order_modal: false || this.props.hasOwnProperty('show_order_modal'),
            show_app_modal: false,
            show_address_modal: false,
            xs: false
        };
    },
    componentDidMount() {
        this.setState({xs:Math.max(document.documentElement.clientWidth, window.innerWidth || 0) <= 768});
    },
    startAuth() {
        gAuth().then(function(response) {});
    },
    _toggleOrderModal() {
        this.setState({show_order_modal: !this.state.show_order_modal});
    },
    _toggleAddressModal() {
        this.setState({ show_address_modal: !this.state.show_address_modal });
    },
    _toggleAppModal() {
        this.setState({ show_app_modal: !this.state.show_app_modal });
    },
    _hideAllModal() {
        this.setState({
            show_order_modal: false,
            show_app_modal: false,
            show_address_modal: false
        })
    },
    _wishlistAdd() {
        OrderUtils.addToWishlist(this.props.user.user_id, this.props.item_data.item_id);
    },
    _wishlistRemove() {
        OrderUtils.removeFromWishlist(this.props.user.user_id, this.props.item_data.item_id);
    },
    _readMore(e) {
        e.preventDefault();
        $('.summary').text(this.props.item_data.summary); 
    },
    render() {
        /*
        let categories = this.props.item_data.categories.map((category, i) => {
            let key = 'category-'+category.category_id;
            let last_el = this.props.item_data.categories.length-1 !== i ? ', ': ''; 
            return <span className="category-tag" key={key}><a href={category.slug_url}>{category.category_name}</a>{last_el}</span>;
        });
      
        let ratings = null;
        if(this.props.item_data.ratings) { 
            ratings = Array.apply(null, Array(parseInt(this.props.item_data.ratings))).map((_, i) => {
                return <span className="glyphicon glyphicon-star" aria-hidden="true"></span>;
            });
            if (ratings.length < this.props.item_data.ratings) {
                ratings.push(<span className="glyphicon glyphicon-star star-half" aria-hidden="true"></span>);
            }
        }
        */
        let categories = ItemUtils.getCategories(this.props.item_data.categories);
        let ratings = ItemUtils.getRatings(this.props.item_data.ratings);
        let summary = this.state.xs ? this.props.item_data.summary.slice(0, 150) : this.props.item_data.summary;

        return(
            <div id="itempage">
                <Navbar {...this.props} />
                <section className="itempage-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-9 item-container">
                                <div className="row">
                                    <div className="col-lg-3 col-sm-3 img-container">
                                        <img src={this.props.item_data.img_small} alt={this.props.item_data.item_name} />
                                    </div> 
                                    <div className="col-lg-9 col-sm-9 iteminfo-container">
                                        <h2>{this.props.item_data.item_name}</h2>
                                        {this.props.item_data.author ? 
                                        <h4>by {this.props.item_data.author}</h4>
                                        : null}

                                        <div className="itemmeta-container clearfix mt20">
                                            <div className="col-lg-5 col-sm-5">
                                                <div className="item-ratings">
                                                    {ratings}
                                                </div>
                                                { ratings ? 
                                                <div className="item-num-ratings">
                                                    <i>{this.props.item_data.num_ratings} ratings</i>
                                                </div> : null }
                                            </div>
                                            { categories.length ? 
                                                <div className="col-lg-7 col-sm-7 categories-col">
                                                    <div className="category-container clearfix pull-right">
                                                        {categories}
                                                    </div>
                                                </div>
                                            : null }
                                        </div>
                                        
                                        <div className="summary mt20">
                                        { this.props.item_data.summary ?
                                            <span>{summary}
                                            { this.state.xs && this.props.item_data.summary.length > 150 ?
                                                <span>...<a href="#" className="read-more" onClick={this._readMore}>read more &gt;</a></span>
                                            : null}
                                            </span>
                                        : <i className="summary-placeholder">
                                            No description given.    
                                        </i> }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="order-info-container">
                                    <div className="clearfix">
                                        <div className="price-label">M.R.P:</div> 
                                        <div className="price-value">₹ {this.props.item_data.price}</div>
                                    </div>
                                    <div className="clearfix">
                                        <div className="price-label">Rental Amount:</div> 
                                        <div className="price-value">₹ {this.props.item_data.custom_price}</div>
                                    </div>
                                    <div className="clearfix">
                                        <div className="price-label">Rental Period:</div> 
                                        <div className="price-value">{this.props.item_data.custom_return_days ? this.props.item_data.custom_return_days: 21} days</div>
                                    </div>
                                    <div className="action-container text-center">
                                        { this.props.user ? 
                                        <div>
                                            <button className="btn btn-success order-now" onClick={this._toggleOrderModal}>Rent Now</button>
                                            { this.props.user.wishlist.length &&  this.props.user.wishlist.indexOf(this.props.item_data.item_id) > -1 ?
                                                <button className="btn wishlist" onClick={this._wishlistRemove}>Remove from Wishlist</button>
                                              : <button className="btn wishlist" onClick={this._wishlistAdd}>Add to Wishlist</button>
                                            }
                                        </div>
                                        : <a href="#" onClick={this.startAuth}><img className="order-gauth mt20" src={this.props.cdn + "auth/btn_google_signin_dark_normal_web.png"} alt="Ostrich Sign in" srcSet={this.props.cdn + "auth/btn_google_signin_dark_normal_web@2x.png 2x"}/></a> }
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                   </div> 
                   {this.state.show_order_modal ?
                        <OrderModal show={this.state.show_order_modal} 
                                {...this.props} 
                                hide={this._toggleOrderModal} 
                                appModal={this._toggleAppModal}
                                _toggleAddressModal={this._toggleAddressModal}/>
                    : null }
                   {this.state.show_app_modal ?
                        <AppModal show={this.state.show_app_modal} hide={this._toggleAppModal} title="Order Placed Successfully" {...this.props}/>
                    : null }
                   {this.state.show_address_modal ?
                        <AddressModal show={this.state.show_address_modal} toggle={this._toggleAddressModal} hide={this._hideAllModal} user={this.props.user}/>
                    : null }
                </section>
                <Footer {...this.props} />
            </div>
            );
    }
});

module.exports = Item;

