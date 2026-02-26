package com.momcommunity.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.momcommunity.entity.CheckinRecord;
import com.momcommunity.mapper.CheckinRecordMapper;
import com.momcommunity.utils.Result;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CheckinService extends ServiceImpl<CheckinRecordMapper, CheckinRecord> {

    public Result<List<String>> getCheckinDates(Long userId, Integer year, Integer month) {
        String yearMonth = String.format("%d-%02d", year, month);
        List<String> dates = baseMapper.selectCheckinDatesByMonth(userId, yearMonth);
        return Result.success(dates);
    }

    public Result<List<CheckinRecord>> getDailyRecords(Long userId, String date) {
        List<CheckinRecord> records = baseMapper.selectByUserIdAndDate(userId, date);
        return Result.success(records);
    }

    public Result<CheckinRecord> addCheckin(CheckinRecord record) {
        baseMapper.insert(record);
        return Result.success(record);
    }
}
