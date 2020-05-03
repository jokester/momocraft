import React from 'react';

interface ChangelogEntry {
  date: string;
  changes: string[];
}
const changelogContent: ChangelogEntry[] = [{ date: '2020-05-03', changes: ['新的登录页', '新的首页'] }];

const ChangelogEntryView: React.FC<{ entry: ChangelogEntry }> = ({ entry }) => {
  return (
    <div className="mt-3">
      <p className="font-semibold mb-2">{entry.date}</p>
      <ul className="list-disc list-inside">
        {entry.changes.map((_, i) => (
          <li className="my-1" key={i}>
            {_}
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
};

export const ChangelogList: React.FC = () => {
  return (
    <div className="mt-20 px-4 md:px-8 lg:px-16">
      <h2 className="text-xl">最近更新</h2>
      <hr />
      {changelogContent.map((_, i) => (
        <ChangelogEntryView entry={_} key={i} />
      ))}
    </div>
  );
};
