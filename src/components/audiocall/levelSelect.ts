import createNode from '../utils/createNode';

const AUDIO_CALL_DESCRIPTION = 'Тренировка улучшает восприятие речи на слух.';
const GAME_NAME = 'Аудиовызов';
const LEVEL_COUNT = 6;

export class LevelSelect {
  container: HTMLElement;

  selectedValue: string = '0';

  callback: (selectedValue: string) => void;

  wrapper: HTMLElement;

  levelButtons: HTMLElement[] = [];

  constructor(container: HTMLElement, callback: (selectedValue: string)=> void) {
    this.container = container;
    this.callback = callback;
    this.wrapper = createNode({ tag: 'div', classes: ['level-select'] });
  }

  render() {
    const title = createNode({ tag: 'h2', classes: ['game__title'], inner: GAME_NAME });
    const description = createNode({ tag: 'p', classes: ['game__descpiption'], inner: AUDIO_CALL_DESCRIPTION });
    const selectBlock = this.createSelectBlock('Выбери уровень сложности');
    const button = createNode({ tag: 'button', atributesAdnValues: [['type', 'button']], inner: 'начать' });
    button.addEventListener('click', this.returnLevel);
    document.addEventListener('keydown', this.keyHandler);

    this.wrapper.append(title, description, selectBlock, button);
    this.container.append(this.wrapper);
  }

  createSelectBlock(title: string) {
    const wrapper = createNode({ tag: 'div', classes: ['select-block'] });
    const titleNode = createNode({ tag: 'div', classes: ['select-block__title'], inner: title });
    const select = createNode({ tag: 'div', classes: ['select-block__select'] });
    for (let i = 1; i <= LEVEL_COUNT; i += 1) {
      const levelButton = createNode({ tag: 'button', atributesAdnValues: [['data-level', String(i - 1)]], inner: String(i) });
      if (i === 1) levelButton.classList.add('selected');
      this.levelButtons.push(levelButton);
      select.append(levelButton);
    }
    this.levelButtons.forEach((button) => this.addSelectButtonHandler(button));
    wrapper.append(titleNode, select);
    return wrapper;
  }

  addSelectButtonHandler(button: HTMLElement) {
    button.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      this.selectedValue = target.dataset.level || this.selectedValue;
      this.levelButtons.forEach((levelButton) => levelButton.classList.remove('selected'));
      target.classList.add('selected');
    });
  }

  returnLevel = () => {
    this.wrapper.remove();
    document.removeEventListener('keydown', this.keyHandler);
    console.log(this.selectedValue);
    this.callback(this.selectedValue);
  };

  keyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.returnLevel();
      return;
    }
    const level = Number(e.key) - 1;
    if (level >= 0 && level < LEVEL_COUNT) {
      console.log(level);
      this.selectedValue = String(level);
      this.levelButtons.forEach((levelButton) => levelButton.classList.remove('selected'));
      const selectedButton = this.levelButtons
        .find((button) => button.dataset.level === this.selectedValue);
      selectedButton?.classList.add('selected');
    }
  };
}
