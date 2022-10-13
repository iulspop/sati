Imagine

When you can create a prompt.
  Options are:
  Question
  Frequency (assume once a day)
  Type (assume yes/no)

When you visit question queue
  loads any questions not answered for that time

When you answer question
  records answer
  doesn't ask question for that time again

When you look at answers
  lists answers

Concepts:
Prompt:
  A prompt which produces recurring question to collect data

Question:
  A question which collects one answer (data point)

Question Queue:
  A queue where questions appear based on prompt schedule

Answer:
  A data point which records the answer to one question





Story: Create a prompt

As a personal metrics nerd
In order to collect interesting data.
I want to create a recurring prompt

Given there a no prompts
When I create a prompt
Then I should receive a prompt a the times I set

Story: Answer a prompt

Given a prompt
When I enter data
Then data is output

Story: View data

Given data
When I view the data page
Then I see the data


What about when answer prompt, that triggers a port,
you can connect different adapters to it, for example output to google sheet.