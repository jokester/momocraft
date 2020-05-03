import React from 'react';

interface ChangelogEntry {
  date: string;
  changes: string[];
}
const changelogContent: ChangelogEntry[] = [{ date: '2020-05-03', changes: ['新的登录页'] }];

const ChangelogEntryView: React.FC<{ entry: ChangelogEntry }> = ({ entry }) => {
  return (
    <div>
      <p className="font-bold mb-2">{entry.date}</p>
      <ul>
        {entry.changes.map((_, i) => (
          <li key={i}>{_}</li>
        ))}
      </ul>
    </div>
  );
};

export const ChangelogList: React.FC = () => {
  return (
    <div>
      {changelogContent.map((_, i) => (
        <ChangelogEntryView entry={_} key={i} />
      ))}
    </div>
  );
};
