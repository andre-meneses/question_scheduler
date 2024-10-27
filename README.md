# A Question Scheduler: A Mathematical Learning System

## Motivation
Mathematics is not a spectator sport, as the saying goes. To achieve a deep understanding of mathematics, one must actively engage with and struggle through exercises. However, for most people outside the realm of math students, balancing thorough mathematical understanding with reasonable progress presents a challenging dilemma: How can one develop a strong foundation while advancing at a satisfactory pace? How can one both learn extensively and learn well?

## The Learning Challenge
While patience and perseverance traditionally lead to well-cemented knowledge, this approach alone feels insufficient. Mathematical intuition develops through problem-solving, and though consulting solutions is often discouraged in mathematical education, I argue it can be a valuable tool when used thoughtfully. Studying and absorbing others' solutions can enable one to solve similar problems and generalize concepts to new contexts. However, exclusively reviewing solutions would atrophy critical thinking and independent problem-solving skills.

## Proposed Methodology
To address these challenges, I propose the following structured approach:

### Basic Problem-Solving Protocol (2/3 of problems)
1. Set a 30-minute limit for initial problem-solving attempts
2. If unsuccessful, consult and thoroughly internalize the solution
3. Maintain a requirement of fully understanding 2/3 of any problem set, regardless of whether solutions were reached independently or through studying others' approaches

### Advanced Problem-Solving Protocol (1/3 of problems)
1. Select challenging problems for a special queue
2. Assign each problem a total thinking time (3-12 hours)
3. Break down problem-solving sessions into progressive intervals:
   - First attempt: 15 minutes
   - Second attempt: 30 minutes
   - Third attempt: 1 hour
4. Utilize "idle time" for background processing between attempts
5. Review solutions only after depleting allocated time, with some problems designated as "never look up"

## Implementation Philosophy
While one could approach this system with sophisticated operations research techniques to optimize learning outcomes, I prefer maintaining simplicity and personal discretion. The selection of problems follows a uniform distribution, where:
- Each problem has equal probability of being chosen
- Previous attempts and remaining time don't influence selection probability
- Assignment of total thinking time and "never look up" status remains discretionary

## Program Objective
This specification outlines a question scheduler that will:
1. Randomly select problems for solving sessions
2. Track essential metadata:
   - Problem source
   - Attempt history
   - Time allocation and usage
   - Problem type and subject matter
   - Current status

While simple in design, this system aims to balance thorough understanding with steady progress, maintaining both rigor and practicality in mathematical learning.

