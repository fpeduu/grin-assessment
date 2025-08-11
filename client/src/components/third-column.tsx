import { useCallback, useEffect, useRef, useState } from 'react';
import { getPatientSentiment } from '../services/api';
import { Patient } from '../types';
import { PatientListItem } from './patient-list-item';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

import NegativeIcon from '../assets/negative.svg';
import NeutralIcon from '../assets/neutral.svg';
import PositiveIcon from '../assets/positive.svg';

export function ThirdColumn() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastPatientElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const fetchPatients = async (currentPage: number, currentFilter: string) => {
    setLoading(true);
    try {
      const result = await getPatientSentiment(currentPage, 5, currentFilter);
      setPatients((prev) =>
        currentPage === 1 ? result.data : [...prev, ...result.data],
      );
      setHasMore(result.data.length > 0 && result.total > currentPage * 5);
    } catch (error) {
      console.error('Failed to fetch patients', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPatients([]);
    setPage(1);
    setHasMore(true);
    fetchPatients(1, filter);
  }, [filter]);

  useEffect(() => {
    if (page > 1) {
      fetchPatients(page, filter);
    }
  }, [page, filter]);

  const handleFilterChange = (value: string) => {
    setFilter(value || '');
  };

  return (
    <Card className="h-full flex flex-col bg-white border-none shadow-sm">
      <CardHeader>
        <CardTitle>Overall Patients Sentiment</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col overflow-y-auto">
        <ToggleGroup
          type="single"
          className="justify-start mb-4 gap-2"
          onValueChange={handleFilterChange}
          value={filter}
        >
          <ToggleGroupItem
            value="negative"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition
      ${filter === 'negative' ? 'bg-indigo-500 text-white' : ''}`}
          >
            <img src={NegativeIcon} alt="Negative" className="h-4 w-4" />

            <span className="font-medium">Can Be Better</span>
            <span className="font-semibold">6</span>
          </ToggleGroupItem>

          <ToggleGroupItem
            value="neutral"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition
      ${filter === 'neutral' ? 'bg-yellow-500 text-white' : ''}`}
          >
            <img src={NeutralIcon} alt="Neutral" className="h-4 w-4" />
            <span className="font-medium">Neutral</span>
            <span className="font-semibold">2</span>
          </ToggleGroupItem>

          <ToggleGroupItem
            value="positive"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition
      ${filter === 'positive' ? 'bg-green-500 text-white' : ''}`}
          >
            <img src={PositiveIcon} alt="Positive" className="h-4 w-4" />
            <span className="font-medium">Positive</span>
            <span className="font-semibold">4</span>
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex-grow space-y-4 overflow-y-auto">
          {patients.map((patient, index) => (
            <div
              key={patient.id}
              ref={index === patients.length - 1 ? lastPatientElementRef : null}
            >
              <PatientListItem patient={patient} />
            </div>
          ))}
          {loading && <p className="text-center">Loading...</p>}
          {!hasMore && patients.length > 0 && (
            <p className="text-center">No more results.</p>
          )}
          {!loading && patients.length === 0 && (
            <p className="text-center">No results found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
