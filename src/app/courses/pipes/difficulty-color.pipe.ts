// src/app/courses/pipes/difficulty-color.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DifficultyLevel } from '../models/course-interface';

@Pipe({
  name: 'difficultyColor',
})
export class DifficultyColorPipe implements PipeTransform {
  transform(difficulty: DifficultyLevel): string {
    switch (difficulty) {
      case DifficultyLevel.BEGINNER:
        return '#4CAF50'; // Green
      case DifficultyLevel.INTERMEDIATE:
        return '#FF9800'; // Orange
      case DifficultyLevel.ADVANCED:
        return '#F44336'; // Red
      case DifficultyLevel.EXPERT:
        return '#9C27B0'; // Purple
      default:
        return '#757575'; // Grey
    }
  }
}

// src/app/courses/directives/hover-effect.directive.ts
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appHoverEffect]',
})
export class HoverEffectDirective {
  @Input() hoverScale: number = 1.05;
  @Input() hoverColor: string = '';
  @Input() transitionDuration: string = '300ms';

  private originalTransform: string = '';
  private originalBackgroundColor: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      `transform ${this.transitionDuration} ease, background-color ${this.transitionDuration} ease`
    );
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.originalTransform = this.el.nativeElement.style.transform;
    this.originalBackgroundColor = this.el.nativeElement.style.backgroundColor;

    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `scale(${this.hoverScale})`
    );

    if (this.hoverColor) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'background-color',
        this.hoverColor
      );
    }

    this.renderer.addClass(this.el.nativeElement, 'hover-active');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      this.originalTransform
    );

    if (this.hoverColor) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'background-color',
        this.originalBackgroundColor
      );
    }

    this.renderer.removeClass(this.el.nativeElement, 'hover-active');
  }
}
