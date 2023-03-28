"use client"
import Section from "@/components/Section"
import { Box, Typography } from "@mui/material"
import { ReactNode } from "react"


interface AboutViewProps {
  sections: {
    title: string,
    subtitle: string
    content?: ReactNode
  }[]
}

const AboutView = (props: AboutViewProps) => {
  return (
    <>
      {props.sections.map(({ title, subtitle, content }) => (
        <Section key={title} title={title}>
          <Box data-cy="about">
            <Typography data-cy="about-subtitle">
              {subtitle}
            </Typography>
            {content}
          </Box>
        </Section>
      ))}
    </>
  )
}

export default AboutView
