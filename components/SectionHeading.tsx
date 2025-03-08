import ScrollFloat from "@/components/reactbits/ScrollFloat";

type SectionHeadingProps = {
  children: string;
};

export default function SectionHeading({ children }: SectionHeadingProps) {

  return (
    <ScrollFloat
      animationDuration={1}
      ease='back.inOut(2)'
      scrollStart='center bottom+=50%'
      scrollEnd='bottom bottom-=40%'
      stagger={0.03}
      containerClassName="text-3xl font-medium capitalize mb-8 text-center"
    >
      {children}
    </ScrollFloat>
  );
}