import React, { Component } from 'react';

import groupBy from 'lodash/groupBy';
import moment from 'moment';

import Typography from 'material-ui/Typography';

import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { FormControl } from 'material-ui/Form';

const SelectableChip = ({ selected, label, onClick }) => {
  return (
    <Chip
      label={label}
      avatar={
        selected ? (
          <Avatar style={{ backgroundColor: 'green' }}>S</Avatar>
        ) : null
      }
      onClick={onClick}
    />
  );
};

class DataFilterForm extends Component {
  state = {
    selectedYear: null,
    selectedMonth: null,
    selectedDay: null,
    groupedByDays: null,
    groupedByMonths: null,
    groupedByYears: null
  };

  componentWillMount() {
    this.loadVariables(this.props);
  }

  loadVariables(props) {
    let currentValue = props.value || new Date();

    let selectedYear = currentValue.getFullYear();
    let selectedMonth = currentValue.getMonth() + 1;
    let selectedDay = currentValue.getDate();

    const groupedByYears = groupBy(props.validDates, date =>
      date.substring(0, 4)
    );
    const year = groupedByYears[selectedYear];
    if (!year) {
      selectedYear = Object.keys(groupedByYears)[0];
    }

    const groupedByMonths = groupBy(groupedByYears[selectedYear], date =>
      date.substring(5, 7)
    );
    const month = groupedByMonths[selectedMonth];
    if (!month) {
      selectedMonth = Object.keys(groupedByMonths)[0];
    }

    const groupedByDays = groupBy(groupedByMonths[selectedMonth], date =>
      date.substring(8, 10)
    );

    const day = groupedByDays[selectedDay];
    if (!day) {
      selectedDay = Object.keys(groupedByDays)[0];
    }

    let newState = {
      selectedYear,
      selectedMonth,
      selectedDay,
      groupedByDays,
      groupedByMonths,
      groupedByYears
    };

    this.setState(newState);
  }

  componentWillReceiveProps(nextProps) {
    this.loadVariables(nextProps);
  }

  onYearSelected = year => {
    this.setState(
      {
        selectedYear: year
      },
      this.triggerDateChange
    );
  };

  onMonthSelected = month => {
    this.setState(
      {
        selectedMonth: month
      },
      this.triggerDateChange
    );
  };

  onDaySelected = day => {
    this.setState(
      {
        selectedDay: day
      },
      this.triggerDateChange
    );
  };

  triggerDateChange = () => {
    const { selectedYear, selectedMonth, selectedDay } = this.state;
    const date = moment(
      `${selectedYear}${selectedMonth}${selectedDay}`,
      'YYYYMMDD'
    ).toDate();

    this.props.onChange && this.props.onChange(date);
  };

  render() {
    const {
      selectedYear,
      selectedMonth,
      selectedDay,
      groupedByDays,
      groupedByMonths,
      groupedByYears
    } = this.state;

    return (
      <div>
        <FormControl>
          <Typography type="subheading" gutterBottom>
            Year
          </Typography>
          <div style={styles.chipsContainer}>
            {Object.keys(groupedByYears).map(year => (
              <SelectableChip
                key={year}
                label={year}
                selected={year === selectedYear.toString()}
                onClick={this.onYearSelected.bind(this, parseInt(year, 10))}
              />
            ))}
          </div>
        </FormControl>
        <br />
        <FormControl>
          <Typography type="subheading" gutterBottom>
            Month
          </Typography>
          <div style={styles.chipsContainer}>
            {Object.keys(groupedByMonths).map(month => (
              <SelectableChip
                key={month}
                label={month}
                selected={month === selectedMonth.toString()}
                onClick={this.onMonthSelected.bind(this, parseInt(month, 10))}
              />
            ))}
          </div>
        </FormControl>
        <br />
        <FormControl>
          <Typography type="subheading" gutterBottom>
            Day
          </Typography>
          <div style={styles.chipsContainer}>
            {Object.keys(groupedByDays).map(day => (
              <SelectableChip
                key={day}
                label={day}
                selected={day === selectedDay.toString()}
                onClick={this.onDaySelected.bind(this, parseInt(day, 10))}
              />
            ))}
          </div>
        </FormControl>
      </div>
    );
  }
}

const styles = {
  chipsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center'
  }
};

export default DataFilterForm;
