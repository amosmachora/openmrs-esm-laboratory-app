import React from 'react';
import { Button } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { launchWorkspace } from '@openmrs/esm-framework';
import { type Order } from '@openmrs/esm-patient-common-lib';
import styles from './actions.scss';

interface AddLabRequestResultsActionProps {
  order: Order;
}
const AddLabRequestResultsAction: React.FC<AddLabRequestResultsActionProps> = ({ order }) => {
  const { t } = useTranslation();

  return (
    <Button
      className={styles.actionButton}
      kind="primary"
      size="sm"
      key={`${order.uuid}`}
      onClick={() => launchWorkspace('test-results-form-workspace', { order })}
    >
      {t('addLabResult', 'Add lab results')}
    </Button>
  );
};

export default AddLabRequestResultsAction;
