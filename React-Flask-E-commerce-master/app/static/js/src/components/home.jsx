import React from 'react';
import Navbar from './navbar';
import Banner from './banner';
import Footer from './footer';

const Homepage = React.createClass({
    componentDidMount() {
        /*
        $('.collection-ul').slick({
            infinite: false,
            slidesToShow: 5,
            slidesToScroll: 1,
            draggable: true,
            prevArrow: '<a href="#" class="slick-left" onClick="event.preventDefault()"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></a>',
            nextArrow: '<a href="#" class="slick-right" onClick="event.preventDefault()"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></a>',
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }
            ]
        })
        .on('afterChange', () => {
            let currentSlide = $('.collection-ul').slick('slickCurrentSlide');

            if (currentSlide == 0){
                $('.slick-left').hide();
                $('.slick-right').show();
            }
            else if (currentSlide == this.props.collections.length - 5){
                $('.slick-left').show();
                $('.slick-right').hide();
            } else {
                $('.slick-left').show();
                $('.slick-right').show();
            }

        });
        $('.slick-left').hide();
        */

    },
    render() {
        let collections = this.props.collections.map((panel) => {
            return (
                <a href={"/books#collection-"+panel.collection_id}>
                    <div className="collection-li" key={panel.collection_id}>
                    <img src={panel.image} className="collection-img" alt={panel.name}/>
                        <div className="collection-name-container">
                            <span className="collection-span">
                                {panel.name}
                            </span>
                        </div>
                    </div>
                </a>
                );
        });
       return (
            <div id="home">
                <section className="header-section">
                    <Navbar {...this.props} />
                    <Banner />
                </section>
                <section className="collection-section">
                    <div className="container">
                        <div className="row"><div className="col-lg-12 text-center">
                            <h2 className="collection-heading">Don't know what to read?</h2>
                            <h4 className="collection-subheading">Browse through our curated collection</h4>
                        </div></div>
                        <div className="row">
                        <div className="col-lg-12 collection-container">
                            <div className="collection-ul">{collections}</div>
                        </div></div>
                    </div>
                </section>
                <section className="howto-section">
                    <div className="container">
                        <div className="row howto-heading">
                            <div className="col-lg-12 text-center">
                                <h2>How Ostrich helps you</h2>
                            </div>
                        </div>
                        <div className="row howto-content">
                            <div className="col-lg-4">
                                <div className="text-center">
                                    <img className="howto-img" src={this.props.cdn + "tmp/click_120.png"} />
                                    <div className="mt20">You can search for your favourite book and get a premium copy of the title at your doorstep.</div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="text-center">
                                    <img className="howto-img" src={this.props.cdn + "tmp/door_120.png"} />
                                    <div className="mt20">We will deliver books at a time and place decided by you.</div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="text-center">
                                    <img className="howto-img" src={this.props.cdn + "tmp/pay_r_120.png"} />
                                    <div className="mt20">Rental charges are as cheap as a coffee, because nothing should come in the way of reading.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="apps-section">
                    <div className="container">
                        <div className="row apps-heading">
                            <div className="col-lg-12 text-center">
                            <h2>Download our app to enjoy a holisitic experience</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 text-center">
                                <img className="app-img" src={this.props.cdn + "tmp/showcase.png"} alt="Ostrich Android App" />
                            </div>
                            <div className="col-lg-2"></div>
                            <div className="col-lg-6">
                                <div className="app-list-container">
                                    <ul className="app-list">
                                        <li>
                                            <img src={this.props.cdn + "modalImagesPick.png"}/> 
                                            Rent any book in a few taps
                                        </li>
                                        <li>
                                            <img src={this.props.cdn + "modalImagesTrack.png"}/> 
                                            Keep track and extend your orders
                                        </li>
                                        <li>
                                            <img src={this.props.cdn + "modalImagesShare.png"}/> 
                                            Share with your friends
                                        </li>


                                    </ul>
                                </div>
                                <div className="app-link"><a target="_blank" href='https://play.google.com/store/apps/details?id=in.hasslefree.ostrichbooks&hl=en&utm_source=global_co&utm_medium=prtnr&utm_content=Mar2515&utm_campaign=PartBadge&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img id="play-store" alt='Get it on Google Play' width="196" src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png' data-source='home'/></a></div>
                            </div>
                            
                        </div>
                    </div>
                </section>
                <Footer {...this.props} />
           </div>
            );
    }
});

// not compatible with React.createFactory
//export default homepage;
module.exports = Homepage;
/*
<div className="col-lg-6 text-center">
                                <img className="app-img" src="/static/img/tmp/slack-demo.png" />
                                <div className="app-link"><a href="https://slack.com/oauth/authorize?scope=users:read,incoming-webhook,commands&client_id=4256151918.31600537060&redirect_uri=https://ostrich-slack.herokuapp.com/oauth"><img alt="Add to Slack" height="55" width="196" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a></div>
                            </div> 


                                        <li><span className="glyphicon glyphicon-star gold" aria-hidden="true"></span>Keep track and extend your orders</li>
                                        <li><span className="glyphicon glyphicon-star gold" aria-hidden="true"></span>Offer used books and get free credits</li>
                                        <li><span className="glyphicon glyphicon-star gold" aria-hidden="true"></span>Order Collection Sets</li>
                                        <li><span className="glyphicon glyphicon-star gold" aria-hidden="true"></span>Share with your friends</li>
 */
