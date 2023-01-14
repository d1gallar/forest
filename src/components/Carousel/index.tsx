import React, { Component, MouseEvent } from "react";

type CarouselProps = {
  content: Array<{ quote: string; author: string; slideColor: string }>;
  interval: number;
};

type CarouselState = {
  active: number;
};

class Carousel extends Component<CarouselProps, CarouselState> {
  constructor(props: CarouselProps) {
    super(props);
    this.state = {
      active: 0,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  renderSlide() {
    return this.props.content.map((slide, i) => {
      const { quote, author } = slide;
      const { active } = this.state;
      if (i === active) {
        return (
          <div
            key={this.state.active} className={"flex justify-between items-center gap-8 flex-col md:flex-row md:gap-4"}
          >
            <img
              className="scale-90 w-full h-full md:w-1/2"
              src="assets/landing-pic-2.svg
              "
              alt="Plants on a Shelf"
            />
            <div key={i} className={`animate-fadeLeft md:animate-fadeUp w-full px-7 md:p-0 md:w-[45%]`}>
              <q className="font-SansThai font-medium text-white leading-8 tracking-tight text-left text-base md:text-xl">
                {quote}
              </q>
              <p className="font-SansThai font-bold text-white leading-8 tracking-tight text-left mt-5 text-base md:text-xl">
                {author}
              </p>
            </div>
            {this.renderButtons()}
          </div>
        );
      }
      return null;
    });
  }

  renderButtons() {
    const slideLen = this.props.content.length;
    if (slideLen <= 0) return null;
    return (
      <div className="flex items-center flex-row justify-center gap-4 md:flex-col md:gap-10 mx-10">
        {this.props.content.map((slide, i) => {
          const isActive = i === this.state.active ? "" : "opacity-30";
          return (
            <button
              className={`bg-white rounded-full ${isActive} w-4 h-4 md:w-5 md:h-5 `}
              onClick={(e) => this.handleClick(e, i)}
              key={i}
            ></button>
          );
        })}
      </div>
    );
  }

  componentDidMount(): void {
    this.startCarouselTimer();
  }

  startCarouselTimer() {
    setInterval(() => {
      if (this.state.active < this.props.content.length - 1) {
        this.setState({ active: this.state.active + 1 });
      } else {
        this.setState({ active: 0 });
      }
    }, this.props.interval);
  }

  handleClick(event: MouseEvent, index: number) {
    this.setState({ active: index });
  }

  render() {
    const slideColor = this.props.content[this.state.active].slideColor;
    return (
      <div style={{backgroundColor: slideColor}} className="w-full h-fit p-8 transition-colors">{this.renderSlide()}</div>
    );
  }
}

export default Carousel;
