package com.momcommunity.controller;

import com.momcommunity.entity.CheckinRecord;
import com.momcommunity.service.CheckinService;
import com.momcommunity.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/checkin")
public class CheckinController {

    @Autowired
    private CheckinService checkinService;

    @GetMapping("/{userId}/calendar")
    public Result<List<String>> getCheckinDates(
            @PathVariable Long userId,
            @RequestParam Integer year,
            @RequestParam Integer month) {
        return checkinService.getCheckinDates(userId, year, month);
    }

    @GetMapping("/{userId}/daily")
    public Result<List<CheckinRecord>> getDailyRecords(
            @PathVariable Long userId,
            @RequestParam String date) {
        return checkinService.getDailyRecords(userId, date);
    }

    @PostMapping
    public Result<CheckinRecord> addCheckin(@RequestBody CheckinRecord record, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        record.setUserId(userId);
        return checkinService.addCheckin(record);
    }
}
