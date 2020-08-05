import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Day from './Day';

const sortDatesAsc = (date1, date2) => {
  if (date1 > date2) {
    return 1;
  }
  return date1 < date2 ? -1 : 0;
};

export default class Week extends React.Component {

  isBooked(date, isNight) {
    let isBooked = false
    let type = '';
    const sortedBookings = this.props.bookings.sort(booking => sortDatesAsc(booking.date));
    for (let i = 0; i < sortedBookings.length; i += 1) {
      const currentBooking = isNight ? moment(sortedBookings[i].date).add(1, 'days') : sortedBookings[i].date;
      if (date.isSame(currentBooking, 'day')) {
        isBooked = true;
        type = sortedBookings[i].type
        break;
      }
    }
    return { booked: isBooked, type: isBooked ? type : '' };
  }

  isBookedDay(date) {
    const { booked, type } = this.isBooked(date, false)
    return { booked, type };
  }

  isBookedNight(date) {
    const { booked, type } = this.isBooked(date, true)
    return { booked, type };
  }

  render() {
    const days = [];
    const { month } = this.props;
    let { date } = this.props;

    for (let i = 0; i < 7; i += 1) {
      const dayBookedData = this.isBookedDay(date)
      const nightBookedData = this.isBookedDay(date)

      const isBookedDay = dayBookedData.booked
      const dayBookedType = dayBookedData.type
      const isBookedNight = nightBookedData.booked
      const nightBookedType = nightBookedData.type

      const day = {
        name: date.format('dd').substring(0, 1),
        number: date.date(),
        isBookedDay: isBookedDay,
        isBookedNight: isBookedNight,
        dayBookedType: dayBookedType,
        nightBookedType: nightBookedType,
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), 'day'),
        date,
      };
      let className = '';
      if (day.isToday) {
        className += ' today';
      }
      if (!day.isCurrentMonth) {
        className += ' different-month';
      }
      if (day.date.isSame(this.props.selected)) {
        className += ' selected';
      }
      if (day.isBookedDay) {
        className += ' booked-day';
      }
      if (day.isBookedNight) {
        className += ' booked-night';
      }
      if (!this.props.clickable) {
        className += ' not-clickable';
      }
      if (day.dayBookedType === 'block'){
        className+= ' block-day'
      }
      if (day.nightBookedType === 'block'){
        className+= ' block-night'
      }
      days.push(
        <Day
          key={day.date.toString()}
          className={className}
          clickHandler={() => this.props.selectHandler(day)}
        >
          {day.number}
        </Day>,
      );

      date = date.clone();
      date.add(1, 'd');
    }

    return (
      <div className='week' key={days[0].toString()}>
        {days}
      </div>
    );
  }

}

Week.propTypes = {
  bookings: PropTypes.array,
  clickable: PropTypes.bool.isRequired,
  date: PropTypes.instanceOf(moment).isRequired,
  month: PropTypes.instanceOf(moment).isRequired,
  selected: PropTypes.instanceOf(moment),
  selectHandler: PropTypes.func,
};

Week.defaultProps = {
  bookings: [],
  selected: moment().startOf('day'),
  selectHandler: null,
};
