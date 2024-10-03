import { DatePicker, DatePickerInput } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSessionStorage } from '../../hooks/use-session-storage';
import styles from './orders-date-range-picker.scss';

export const OrdersDateRangePicker = () => {
  const currentDate = new Date();
  const { t } = useTranslation();
  const [dateRange, updateDateRange] = useSessionStorage('lab-orders-date-range');

  const handleOrdersDateRangeChange = (dates: Date[]) => {
    updateDateRange(dates);
  };

  return (
    <div className={styles.datePickerWrapper}>
      <p>{t('dateRange', 'Date range')}:</p>
      <DatePicker
        datePickerType="range"
        className={styles.dateRangePicker}
        onClose={handleOrdersDateRangeChange}
        maxDate={currentDate.toISOString()}
        value={dateRange}
      >
        <DatePickerInput id="date-picker-input-id-start" placeholder="mm/dd/yyyy" size="md" />
        <DatePickerInput id="date-picker-input-id-finish" placeholder="mm/dd/yyyy" size="md" />
      </DatePicker>
    </div>
  );
};
