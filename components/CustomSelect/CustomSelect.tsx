import * as Select from '@radix-ui/react-select';
import css from './CustomSelect.module.css';

type SelectEvent = { target: { name: string; value: string } };

interface CustomSelectProps {
  name: string;
  placeholder: string;
  list: string[] | number[];
  value: string;
  onChange: (event: SelectEvent) => void;
  className?: string;
  contentClassName?: string;
}
export function CustomSelect({
  name,
  placeholder,
  list,
  value,
  onChange,
  className,
  contentClassName,
}: CustomSelectProps) {
  return (
    <Select.Root
      value={value}
      onValueChange={value =>
        onChange({ target: { name, value: String(value) } })
      }
      defaultValue={placeholder}
    >
      <Select.Trigger className={`${css.trigger} ${className ?? ''}`}>
        <Select.Value placeholder={placeholder} />

        <Select.Icon className={css.icon}>
          <svg
            className={css.selectIcon}
            width="13"
            height="7"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/icons.svg#icon-chevron-up" />
          </svg>
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className={`${css.content} ${contentClassName ?? ''}`}
          position="popper"
          sideOffset={4}
        >
          <Select.Viewport className={css.viewport}>
            {list.map(item => (
              <Select.Item
                key={item}
                value={item.toString()}
                className={css.item}
              >
                <Select.ItemText>{item}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
