import ResourceManager from '../../components/admin/ResourceManager.jsx';
import { portfolioApi } from '../../api/client.js';

export default function MetricsManager() {
  return (
    <ResourceManager
      title="60-second scan metrics"
      api={portfolioApi.metrics}
      newRecord={() => ({ value: 0, displaySuffix: '', label: '', description: '' })}
      renderSummary={(m) => m.label || 'Metric'}
      fields={[
        { key: 'label', label: 'Label' },
        { key: 'value', label: 'Target value (number)', type: 'number' },
        { key: 'displaySuffix', label: 'Suffix (e.g. ms, %, ★)' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ]}
    />
  );
}
