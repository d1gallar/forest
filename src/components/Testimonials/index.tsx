import React, { Component } from "react";
import Carousel from "../Carousel";

// Testimonials Slides
const SLIDE_CONTENT = [
  {
    quote:
      "A fast way to get new plants. They got delivered in a few days and looked pretty! Definitely would recommend to another friend.",
    author: "Elise P.",
    slideColor: '#CFC8AB'
  },
  {
    quote:
      "A wonderful way to order plants. I am very happy with their service. I think I would order from here again!",
    author: "Kelly H.",
    slideColor: '#DBA895'
  },
  {
    quote:
      "My plants got delivered here in two days! The plants I received were very gorgeous and healthy! Everything was intact!",
    author: "Mary K.",
    slideColor: '#C1C5DB'
  },
];

const SLIDE_INTERVAL = 5000; // 5s

class Testimonials extends Component {
  render(): React.ReactNode {
    return (
      <section>
        <Carousel content={SLIDE_CONTENT} interval={SLIDE_INTERVAL} />
      </section>
    );
  }
}

export default Testimonials;
