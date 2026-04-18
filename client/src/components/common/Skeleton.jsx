import React from 'react';
import './Skeleton.css';

/**
 * Skeleton Loader - Placeholder while data loads
 * Shows shimmer animation
 */
export const Skeleton = ({ width = '100%', height = '20px', circle = false, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${circle ? 'skeleton-circle' : ''}`}
          style={{
            width: circle ? height : width,
            height,
            borderRadius: circle ? '50%' : '4px',
            marginBottom: circle ? 0 : '12px',
          }}
        />
      ))}
    </>
  );
};

/**
 * Form Skeleton - Placeholder for form inputs
 */
export const FormSkeleton = () => (
  <div className="form-skeleton">
    <div className="form-group">
      <Skeleton width="100px" height="16px" />
      <Skeleton width="100%" height="40px" style={{ marginTop: '8px' }} />
    </div>
    <div className="form-group">
      <Skeleton width="100px" height="16px" />
      <Skeleton width="100%" height="40px" style={{ marginTop: '8px' }} />
    </div>
    <div className="form-group">
      <Skeleton width="100px" height="16px" />
      <Skeleton width="100%" height="100px" style={{ marginTop: '8px' }} />
    </div>
    <Skeleton width="120px" height="40px" style={{ marginTop: '16px' }} />
  </div>
);

/**
 * Tax Results Skeleton - Placeholder for tax calculation results
 */
export const TaxResultsSkeleton = () => (
  <div className="tax-results-skeleton">
    <div className="result-card">
      <Skeleton width="150px" height="16px" />
      <Skeleton width="100px" height="24px" style={{ marginTop: '12px' }} />
    </div>
    <div className="result-card">
      <Skeleton width="150px" height="16px" />
      <Skeleton width="100px" height="24px" style={{ marginTop: '12px' }} />
    </div>
    <div className="result-card">
      <Skeleton width="150px" height="16px" />
      <Skeleton width="100px" height="24px" style={{ marginTop: '12px' }} />
    </div>
  </div>
);

/**
 * Table Skeleton - Placeholder for data tables
 */
export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="table-skeleton">
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div key={rowIdx} className="table-row">
        {Array.from({ length: cols }).map((_, colIdx) => (
          <Skeleton key={colIdx} width="100%" height="20px" />
        ))}
      </div>
    ))}
  </div>
);

/**
 * List Skeleton - Placeholder for lists
 */
export const ListSkeleton = ({ count = 5 }) => (
  <div className="list-skeleton">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="list-item">
        <Skeleton width="40px" height="40px" circle />
        <div style={{ flex: 1, marginLeft: '12px' }}>
          <Skeleton width="80%" height="16px" />
          <Skeleton width="60%" height="14px" style={{ marginTop: '8px' }} />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
