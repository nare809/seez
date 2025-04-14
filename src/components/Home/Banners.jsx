import React from 'react';
import { Link } from 'react-router-dom';
import './Banners.scss';

function Banners() {
  return (
    <div className="main-blogs">
      <div className="main-blog anim" style={{"--delay": ".2s"}}>
        <div className="main-blog__title">
          Discover the movies and TV shows and stream all free and unlimited.
        </div>
        <div className="main-blog__author">
          <div className="author-detail">
            <div className="main-blog__author">
              <div className="author-img__wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <img className="author-img" src="https://i.imgur.com/pR1jZly.png" alt="HD Quality" />
              </div>
              <div className="auth-detail">
                <div className="author-name">Yes, It&apos;s all free</div>
                <div className="author-info">
                  HD Quality
                  <span className="seperate" />
                  CC
                  <span className="seperate" />
                  Watchlist
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main-blog__time">
          <Link className="buttongg" to="/movies/year/2025">New Movies!</Link>
        </div>
      </div>
      
      <div className="main-blog anim" style={{"--delay": ".1s"}}>
        <div className="main-blog__title">
          If you like us share our site to your friends.
        </div>
        <div className="main-blog__author">
          <div className="author-detail">
            <div className="author-name">Join to our official telegram and discord groups</div>
            <div className="author-info">
              Invite Code 
              <span className="seperate" /> 
              Freebies
              <span className="seperate" /> 
              Rewards
            </div>
          </div>
        </div>
        <div className="main-blog__time1">
          <a className="buttongg" href="https://t.me/+vekZX4KtMPtiYmRl" target="_blank" rel="noopener noreferrer">Telegram</a>
        </div>
        <div className="main-blog__time">
          <Link className="buttongg" to="/discord">Discord</Link>
        </div>
      </div>
    </div>
  );
}

export default Banners; 