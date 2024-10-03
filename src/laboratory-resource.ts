import { openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import { Order } from '@openmrs/esm-patient-common-lib';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useSessionStorage } from './hooks/use-session-storage';
import { FulfillerStatus, GroupedOrders } from './types';

/**
 * Custom hook for retrieving laboratory orders based on the specified status.
 *
 * @param status - The status of the orders to retrieve
 * @param excludeCanceled - Whether to exclude canceled, discontinued and expired orders
 */
export function useLabOrders(status: 'NEW' | FulfillerStatus = null, excludeCanceled = true) {
  const [dateRange] = useSessionStorage<Array<Date>>('lab-orders-date-range');
  const { laboratoryOrderTypeUuid } = useConfig();
  const fulfillerStatus = useMemo(() => (status === 'NEW' ? null : status), [status]);
  const newOrdersOnly = status === 'NEW';
  let url = `${restBaseUrl}/order?orderTypes=${laboratoryOrderTypeUuid}&v=full`;
  url = fulfillerStatus ? url + `&fulfillerStatus=${fulfillerStatus}` : url;
  url = excludeCanceled ? `${url}&excludeCanceledAndExpired=true&excludeDiscontinueOrders=true` : url;
  // The usage of SWR's mutator seems to only suffice for cases where we don't apply a status filter
  url =
    Array.isArray(dateRange) && dateRange.length === 2 && dateRange[0] instanceof Date && dateRange[1] instanceof Date
      ? `${url}&activatedOnOrAfterDate=${dateRange[0].toISOString()}&activatedOnOrBeforeDate=${dateRange[1].toISOString()}`
      : url;

  const { data, error, mutate, isLoading, isValidating } = useSWR<{
    data: { results: Array<Order> };
  }>(`${url}`, openmrsFetch);

  const filteredOrders =
    data?.data &&
    newOrdersOnly &&
    data.data.results.filter((order) => order?.action === 'NEW' && order?.fulfillerStatus === null);
  return {
    labOrders: filteredOrders || data?.data.results || [],
    isLoading,
    isError: error,
    mutate,
    isValidating,
  };
}
export function useSearchGroupedResults(data: Array<GroupedOrders>, searchString: string) {
  const searchResults = useMemo(() => {
    if (searchString && searchString.trim() !== '') {
      // Normalize the search string to lowercase
      const lowerSearchString = searchString.toLowerCase();
      return data.filter((orderGroup) =>
        orderGroup.orders.some(
          (order) =>
            order.orderNumber.toLowerCase().includes(lowerSearchString) ||
            order.patient.display.toLowerCase().includes(lowerSearchString),
        ),
      );
    }

    return data;
  }, [searchString, data]);

  return searchResults;
}
export function setFulfillerStatus(orderId: string, status: FulfillerStatus, abortController: AbortController) {
  return openmrsFetch(`${restBaseUrl}/order/${orderId}/fulfillerdetails/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: { fulfillerStatus: status },
  });
}

export function rejectLabOrder(orderId: string, comment: string, abortController: AbortController) {
  return openmrsFetch(`${restBaseUrl}/order/${orderId}/fulfillerdetails/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: {
      fulfillerStatus: 'DECLINED',
      fulfillerComment: comment,
    },
  });
}
