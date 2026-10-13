import React from 'react';

/**
 * Исходный сырой вариант компонента ДО применения правил .cursorrules
 * Демонстрирует типичные проблемы: props: any, инлайн-стили, отсутствие типов
 */
export default function DocumentCardBefore(props: any) {
  const getBadgeColor = (level: string) => {
    if (level === 'confidential') return 'red';
    if (level === 'internal') return 'yellow';
    return 'green';
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', margin: '10px 0' }}>
      <h3>{props.title}</h3>
      <p>Отдел: {props.department}</p>
      <span style={{ color: getBadgeColor(props.level), fontWeight: 'bold' }}>
        {props.level}
      </span>
      <div>Обновлено: {props.updatedAt}</div>
      <button onClick={() => props.onOpen(props.id)}>
        Открыть
      </button>
    </div>
  );
}
