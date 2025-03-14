import themeSection from './function/themeSection.js';
import { section as SchemaColors } from './sections/schema-colors.js';
import { section as Slider } from './sections/slider';
import { section as Popup } from './sections/popup-section';
[
	SchemaColors,
	Popup,
	Slider,
].map(section => themeSection(section));