// components/CalendarSelector.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Container = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const DateButton = styled.button<{ selected: boolean }>`
  margin: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(1)};
  background-color: ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.surface};
  color: ${({ selected, theme }) => selected ? theme.colors.textPrimary : theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
`;

const StyledDatePicker = styled(DatePicker)`
  padding: ${({ theme }) => theme.spacing(1)};
  margin-right: ${({ theme }) => theme.spacing(1)};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing(1)};
  margin-right: ${({ theme }) => theme.spacing(1)};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textPrimary};
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

interface CalendarSelectorProps {
  selectedDates: Date[];
  setSelectedDates: React.Dispatch<React.SetStateAction<Date[]>>;
}

const CalendarSelector: React.FC<CalendarSelectorProps> = ({ selectedDates, setSelectedDates }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDateClick = (date: Date) => {
    if (selectedDates.some(d => d.getTime() === date.getTime())) {
      setSelectedDates(selectedDates.filter(d => d.getTime() !== date.getTime()));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleDateRangeSelection = () => {
    if (startDate && endDate) {
      let currentDate = new Date(startDate.getTime());
      const dates = [];
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setSelectedDates(dates);
      setError(null);
    } else {
      setError("Please select both start and end dates.");
    }
  };

  const clearDateRange = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedDates([]);
    setError(null);
  };

  return (
    <Container>
      <h3>Select Dates</h3>
      <div>
        <StyledDatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
        />
        <StyledDatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
        />
        <Button onClick={handleDateRangeSelection}>Add Date Range</Button>
        <Button onClick={clearDateRange}>Clear</Button>
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <div>
        {selectedDates.map((date, index) => (
          <DateButton
            key={index}
            selected={selectedDates.some(d => d.getTime() === date.getTime())}
            onClick={() => handleDateClick(date)}
          >
            {date.toLocaleDateString()}
          </DateButton>
        ))}
      </div>
    </Container>
  );
};

export default CalendarSelector;