/*
| Developed by Fluid
| Filename : CardHeader.tsx
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { type Component } from 'solid-js';

import { Divider } from '../Divider/Divider';
import { Typography } from '../Typography/Typography';

/*
|--------------------------------------------------------------------------
| Card header
|--------------------------------------------------------------------------
*/

// Props interface
// --------------------------------------------------------------------------
interface CardHeaderProps {
  title: string;
  description: string;
}

// Card header component
// --------------------------------------------------------------------------
export const CardHeader: Component<CardHeaderProps> = (props) => {
  return (
    <div class="mb-4 flex flex-col gap-y-2">
      <Typography variation="cardTitle">{props.title}</Typography>
      <Typography>{props.description}</Typography>
      <Divider />
    </div>
  );
};
