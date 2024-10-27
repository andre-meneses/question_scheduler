# Question Scheduler

## An informal specification

"Mathematics is not a spectator sport," as the saying goes. Achieving a profound understanding of mathematics requires grappling with exercises and working through challenging problems. However, for most people outside the realm of professional mathematicians and math students, finding the time to engage deeply with difficult problems while progressing through new material at a reasonable pace is a genuine challenge. This dilemma presents itself: how does one build a solid foundation in mathematics while advancing steadily? How can one both "know it all" (at least as far as one desires) and "know it well"?

One might argue that persistence and patience are the key—that a strong, well-cemented knowledge will come with time. While this is a reasonable approach, it doesn’t fully satisfy my own aspirations. To master complex problems and develop a deeper intuition, one must actively engage in problem-solving, and in my view, occasionally relying on solutions can be constructive. Understanding and internalizing a solution, even if it was not self-derived, allows one to approach similar problems with a more nuanced perspective and extend that knowledge to other areas. However, if one becomes too dependent on solutions, crucial skills in problem-solving, independent thinking, and critical analysis risk being underdeveloped.

With these considerations in mind, I have devised a personal approach to studying mathematics, guided by a few core principles:

1. **Divide and Conquer the Problem Set**: For any given set of problems, my goal is to fully solve and understand two-thirds of the problems, regardless of whether I arrive at the solution independently or by studying a provided solution. This approach allows me to build intuition without excessive time commitment.

2. **Time-Limited Problem-Solving**: I allow myself up to 30 minutes to solve each problem. If I reach the limit without success, I review the solution carefully, working to internalize the method as thoroughly as possible.

3. **The "Difficult Third"**: For the remaining one-third of problems that I cannot solve, I assign a total “thinking time” ranging from 3 to 12 hours. However, this time is spread across several sessions, with intervals that increase incrementally: starting with 15 minutes, then progressing to 30 minutes, and finally to one-hour sessions. This staggered approach allows me to use “idle time” to keep challenging problems in the back of my mind, leveraging subconscious cognitive processing.

   - For instance, if a problem has a total thinking time of 3 hours, the first attempt will last only 15 minutes. If I don’t solve it within that period, I move on to the next problem. On the next round with this problem, I allot 30 minutes, then one hour on the third attempt, and so forth.

4. **Solution-Limited Problems**: Some problems will be selected to remain unsolved indefinitely, without ever consulting the solution. If I never solve them, so be it.

Assignments to this challenging third, the choice of thinking time, and the decision to never view certain solutions are at my discretion. While this approach could undoubtedly be optimized with sophisticated methods or operations research, such as maximizing learning within limited time constraints, I prefer a more intuitive approach, at least for now.

5. **Uniform Random Selection**: Problems are chosen randomly for each session, without factoring in the number of previous attempts or the remaining thinking time.

Hence, this program will act as a straightforward question scheduler, designed to randomly draw problems for each session while tracking metadata, such as the source, attempts made, current session time, total thinking time, problem type, and subject area. I envision it as a simple but hopefully effective tool for systematic mathematical learning.
