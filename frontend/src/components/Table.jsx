import React from 'react';

const Table = ({ headers = [], children, className = '' }) => {
  return (
    <div className={`overflow-x-auto w-full rounded-2xl border border-darkBorder ${className}`}>
      <table className="min-w-full divide-y divide-darkBorder bg-darkCard/30">
        <thead className="bg-darkCard">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-darkBorder"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-darkBorder/50">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
