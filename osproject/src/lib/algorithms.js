export function runSchedulingAlgorithm(processesList, algorithm, timeQuantum = 2) {
  // Clone and sort processes by arrival time
  const processes = processesList.map(p => ({ ...p })).sort((a, b) => a.at - b.at);
  const n = processes.length;
  
  let events = [];
  let stats = [];
  
  if (algorithm === 'FCFS') {
    let currentTime = 0;
    
    for (let i = 0; i < n; i++) {
      const p = processes[i];
      if (currentTime < p.at) {
        // Idle time
        events.push({ processId: 'Idle', start: currentTime, end: p.at, color: '#334155' });
        currentTime = p.at;
      }
      
      const start = currentTime;
      const end = start + p.bt;
      events.push({ processId: p.id, start, end, color: p.color });
      
      stats.push({
        id: p.id,
        at: p.at,
        bt: p.bt,
        ct: end,
        tat: end - p.at,
        wt: end - p.at - p.bt,
        color: p.color
      });
      
      currentTime = end;
    }
  } else if (algorithm === 'SJF') {
    // Non-preemptive Shortest Job First
    let currentTime = 0;
    let completed = 0;
    let isCompleted = new Array(n).fill(false);
    
    while (completed !== n) {
      // Find process with min BT among arrived and not completed
      let minBt = Infinity;
      let minIndex = -1;
      
      for (let i = 0; i < n; i++) {
        if (processes[i].at <= currentTime && !isCompleted[i]) {
          if (processes[i].bt < minBt) {
            minBt = processes[i].bt;
            minIndex = i;
          }
          // If arrival times and burst times are equal, FCFS breaks tie
          if (processes[i].bt === minBt) {
            if (minIndex === -1 || processes[i].at < processes[minIndex].at) {
              minBt = processes[i].bt;
              minIndex = i;
            }
          }
        }
      }
      
      if (minIndex === -1) {
        // If no process has arrived, CPU is idle
        let nextArrival = Infinity;
        for (let i = 0; i < n; i++) {
          if (!isCompleted[i] && processes[i].at < nextArrival) {
            nextArrival = processes[i].at;
          }
        }
        events.push({ processId: 'Idle', start: currentTime, end: nextArrival, color: '#334155' });
        currentTime = nextArrival;
      } else {
        const p = processes[minIndex];
        const start = currentTime;
        const end = start + p.bt;
        
        events.push({ processId: p.id, start, end, color: p.color });
        
        stats.push({
          id: p.id,
          at: p.at,
          bt: p.bt,
          ct: end,
          tat: end - p.at,
          wt: end - p.at - p.bt,
          color: p.color
        });
        
        isCompleted[minIndex] = true;
        completed++;
        currentTime = end;
      }
    }
  } else if (algorithm === 'RR') {
    let currentTime = 0;
    let completed = 0;
    let remainingTime = processes.map(p => p.bt);
    
    let queue = [];
    let isAddedToQueue = new Array(n).fill(false);
    
    // Initial check for arrivals at t=0
    for(let i = 0; i < n; i++) {
        if(processes[i].at <= currentTime && !isAddedToQueue[i]) {
            queue.push(i);
            isAddedToQueue[i] = true;
        }
    }

    while (completed !== n) {
      if (queue.length === 0) {
        // Find next arrival
        let nextArrival = Infinity;
        for (let i = 0; i < n; i++) {
          if (remainingTime[i] > 0 && processes[i].at < nextArrival) {
            nextArrival = processes[i].at;
          }
        }
        events.push({ processId: 'Idle', start: currentTime, end: nextArrival, color: '#334155' });
        currentTime = nextArrival;
        
        // Add newly arrived
        for(let i = 0; i < n; i++) {
            if(processes[i].at <= currentTime && !isAddedToQueue[i]) {
                queue.push(i);
                isAddedToQueue[i] = true;
            }
        }
        continue;
      }
      
      let pIndex = queue.shift();
      let p = processes[pIndex];
      
      let executeTime = Math.min(timeQuantum, remainingTime[pIndex]);
      let start = currentTime;
      let end = start + executeTime;
      
      // Attempt to merge consecutive events of same process
      if (events.length > 0 && events[events.length - 1].processId === p.id) {
          events[events.length - 1].end = end;
      } else {
          events.push({ processId: p.id, start, end, color: p.color });
      }
      
      currentTime = end;
      remainingTime[pIndex] -= executeTime;
      
      // Check arrivals during execution
      for(let i = 0; i < n; i++) {
          if(processes[i].at > start && processes[i].at <= currentTime && !isAddedToQueue[i]) {
              queue.push(i);
              isAddedToQueue[i] = true;
          }
      }
      
      if (remainingTime[pIndex] > 0) {
        queue.push(pIndex);
      } else {
        completed++;
        stats.push({
          id: p.id,
          at: p.at,
          bt: p.bt,
          ct: end,
          tat: end - p.at,
          wt: end - p.at - p.bt,
          color: p.color
        });
      }
    }
  }
  
  // Sort stats back by Process ID
  stats.sort((a, b) => {
      const numA = parseInt(a.id.replace('P', ''));
      const numB = parseInt(b.id.replace('P', ''));
      return numA - numB;
  });
  
  return { events, stats };
}
